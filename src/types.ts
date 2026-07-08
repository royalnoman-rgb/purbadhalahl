export type CategoryId = 
  | 'police' 
  | 'fire_service' 
  | 'hospital' 
  | 'electricity' 
  | 'blood_bank' 
  | 'representatives'
  | 'upazila_parishad'
  | 'transportation'
  | 'healthcare'
  | 'home_services'
  | 'education'
  | 'business'
  | 'financial'
  | 'journalists';

export interface Category {
  id: CategoryId;
  title: string;
  englishTitle: string;
  iconName: string;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  details?: string;
  subDetails?: string;
  categoryId: CategoryId;
}
