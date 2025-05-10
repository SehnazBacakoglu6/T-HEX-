// Kullanıcı Tipleri
export interface User {
    id: number;
    ad: string;
    soyad: string;
    departman: string;
    pozisyon: string;
    iseGirisTarihi: string;
    kalanIzinHakki: number;
    dogumTarihi?: string;
    email: string;
    password: string; // Gerçek uygulamada daha güvenli bir yaklaşım kullanılmalıdır
  }
  
  // İzin Talep Durumu
  export enum IzinTalepDurumu {
    BEKLIYOR = "Bekliyor",
    ONAYLANDI = "Onaylandı",
    REDDEDILDI = "Reddedildi"
  }
  
  // İzin Talep Tipi
  export enum IzinTalepTipi {
    YILLIK_IZIN = "Yıllık İzin",
    ACIL_DURUM = "Acil Durum İzni",
    DOGUM_GUNU = "Doğum Günü İzni"
  }
  
  // İzin Talebi
  export interface IzinTalebi {
    id: number;
    kullaniciId: number;
    baslangicTarihi: string;
    bitisTarihi: string;
    gun: number;
    aciklama: string;
    talepTarihi: string;
    durum: IzinTalepDurumu;
    izinTipi: IzinTalepTipi;
    onaylayanId?: number;
    redSebebi?: string;
  }
  
  // Proje
  export interface Proje {
    id: number;
    ad: string;
    teslimTarihi: string;
    izinYasakliBaslangic: string;
    izinYasakliBitis: string;
  }
  
  // Departman
  export interface Departman {
    id: number;
    ad: string;
    calisanSayisi: number;
    maksimumIzinliCalisan: number;
  }