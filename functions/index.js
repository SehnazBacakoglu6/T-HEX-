const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const DEPARTMENT_QUOTA = 0.2; // %20
const MAX_SUMMER_DAYS = 6;
const SUMMER_START = '2024-06-01';
const SUMMER_END = '2024-08-31';

const RESTRICTED_PERIODS = [
    {
        project: 'Ankara Otoyol Projesi',
        date: '2024-06-25',
        range: 7 // öncesi ve sonrası 7 gün
    },
    {
        project: 'İstanbul Marina',
        date: '2024-09-15',
        range: 7
    },
    {
        project: 'İzmir Konut Projesi',
        date: '2024-12-10',
        range: 7
    }
];

const PERFORMANCE_PERIOD = {
    start: '2024-12-01',
    end: '2025-01-15'
};

exports.analyzeLeaveRequests = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();

    // Tüm izin taleplerini al
    const requestsSnapshot = await db.collection('leave_requests').get();
    const requests = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // Tüm kullanıcıları al
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = { id: doc.id, ...doc.data() };
        return acc;
    }, {});

    // Her talep için analiz yap
    for (const request of requests) {
        if (request.status !== 'pending') continue;

        const user = users[request.user_id];
        if (!user) continue;

        const startDate = new Date(request.start_date);
        const endDate = new Date(request.end_date);

        let decision = 'approved';
        let reason = '';

        // 1. İlk 6 ay kontrolü
        const hireDate = new Date(user.hire_date);
        const sixMonthsLater = new Date(hireDate.setMonth(hireDate.getMonth() + 6));
        if (startDate < sixMonthsLater) {
            decision = 'rejected';
            reason = 'İlk 6 ay dolmadan izin kullanılamaz.';
            await updateRequest(db, request.id, decision, reason);
            continue;
        }

        // 2. Performans değerlendirme dönemi kontrolü
        const perfStart = new Date(PERFORMANCE_PERIOD.start);
        const perfEnd = new Date(PERFORMANCE_PERIOD.end);
        if (startDate >= perfStart && endDate <= perfEnd) {
            decision = 'rejected';
            reason = 'Performans değerlendirme döneminde izin kullanılamaz.';
            await updateRequest(db, request.id, decision, reason);
            continue;
        }

        // 3. Proje teslim dönemleri kontrolü
        for (const period of RESTRICTED_PERIODS) {
            const projectDate = new Date(period.date);
            const rangeStart = new Date(projectDate.setDate(projectDate.getDate() - period.range));
            const rangeEnd = new Date(projectDate.setDate(projectDate.getDate() + period.range * 2));

            if (startDate >= rangeStart && endDate <= rangeEnd) {
                decision = 'rejected';
                reason = `${period.project} teslim döneminde izin kullanılamaz.`;
                await updateRequest(db, request.id, decision, reason);
                continue;
            }
        }

        // 4. Yaz kotası kontrolü
        const summerStart = new Date(SUMMER_START);
        const summerEnd = new Date(SUMMER_END);
        if (startDate >= summerStart && endDate <= summerEnd) {
            // Kullanıcının yaz döneminde kullandığı toplam gün sayısını hesapla
            const summerRequests = requests.filter(r =>
                r.user_id === user.id &&
                r.status === 'approved' &&
                new Date(r.start_date) >= summerStart &&
                new Date(r.end_date) <= summerEnd
            );

            const totalSummerDays = summerRequests.reduce((total, r) => total + r.days_requested, 0);
            if (totalSummerDays + request.days_requested > MAX_SUMMER_DAYS) {
                decision = 'rejected';
                reason = 'Yaz döneminde maksimum 6 gün izin kullanılabilir.';
                await updateRequest(db, request.id, decision, reason);
                continue;
            }
        }

        // 5. Departman kotası kontrolü
        const departmentRequests = requests.filter(r =>
            users[r.user_id]?.department === user.department &&
            r.status === 'approved' &&
            new Date(r.start_date) <= endDate &&
            new Date(r.end_date) >= startDate
        );

        const departmentUsers = Object.values(users).filter(u => u.department === user.department);
        const maxSimultaneous = Math.floor(departmentUsers.length * DEPARTMENT_QUOTA);

        if (departmentRequests.length >= maxSimultaneous) {
            decision = 'rejected';
            reason = 'Departman kotası dolu.';
            await updateRequest(db, request.id, decision, reason);
            continue;
        }

        // 6. Aynı pozisyonda çakışma kontrolü
        const positionRequests = requests.filter(r =>
            users[r.user_id]?.position === user.position &&
            r.status === 'approved' &&
            new Date(r.start_date) <= endDate &&
            new Date(r.end_date) >= startDate
        );

        if (positionRequests.length > 0) {
            // Kıdem kontrolü
            const conflictingUsers = positionRequests.map(r => users[r.user_id]);
            const hasMoreSenior = conflictingUsers.some(u =>
                new Date(u.hire_date) < new Date(user.hire_date)
            );

            if (hasMoreSenior) {
                decision = 'rejected';
                reason = 'Aynı pozisyonda kıdemli çalışan izinli.';
                await updateRequest(db, request.id, decision, reason);
                continue;
            }
        }

        // Tüm kontrollerden geçti
        reason = 'Tüm kriterler uygun.';
        await updateRequest(db, request.id, decision, reason);
    }

    return { success: true };
});

async function updateRequest(db, requestId, decision, reason) {
    await db.collection('leave_requests').doc(requestId).update({
        ai_decision: decision,
        ai_reason: reason,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
} 