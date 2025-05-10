import * as XLSX from 'xlsx';
import { format, parse, differenceInBusinessDays, isWeekend, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

export interface IzinTalebiExcel {
  id: number;
  calisanAd: string;
  calisanSoyad: string;
  departman: string;
  pozisyon: string;
  izinBaslangic: string;
  izinBitis: string;
  izinGun: number;
  izinTipi: string;
  aciklama: string;
  talepTarihi: string;
  durum: string;
}

export const parseExcelFile = async (fileUri: string) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise<any[]>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          
          // Excel verilerini JSON'a dönüştür
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(blob);
    });
  } catch (error) {
    console.error('Excel dosyası işlenirken hata oluştu:', error);
    throw error;
  }
};

export const calculateBusinessDays = (startDate: Date, endDate: Date) => {
  // Hafta sonlarını hariç tutarak iş günü sayısını hesapla
  let gunSayisi = differenceInBusinessDays(endDate, startDate) + 1;
  
  // Hafta sonu kontrolü
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (isWeekend(currentDate)) {
      gunSayisi--;
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return gunSayisi > 0 ? gunSayisi : 0;
};

export const formatTurkishDate = (dateString: string) => {
  try {
    // Farklı tarih formatlarını kontrol et
    let date;
    if (dateString.includes('-')) {
      date = parse(dateString, 'yyyy-MM-dd', new Date());
    } else if (dateString.includes('.')) {
      date = parse(dateString, 'dd.MM.yyyy', new Date());
    } else {
      throw new Error('Desteklenmeyen tarih formatı');
    }
    
    return format(date, 'dd MMMM yyyy', { locale: tr });
  } catch (error) {
    console.error('Tarih formatlanırken hata oluştu:', error);
    return dateString;
  }
};