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
  id: string; // Changed from CategoryId to string so dynamic IDs work
  title: string;
  englishTitle: string;
  iconName: string;
  color: string;
  order?: number;
  subCategoriesOrder?: string[];
  deletedSubCategories?: string[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  details?: string;
  subDetails?: string;
  categoryId: string; // Changed to string
  subCategory?: string;
  order?: number;
}
