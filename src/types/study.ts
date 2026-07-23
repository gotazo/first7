export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface QuickReferenceItem {
  label: string;
  value: string;
  href?: string;
}

export interface StudyLink {
  title: string;
  href: string;
}

export interface StudyNavigationItem extends StudyLink {
  description?: string;
  category?: string;
}

export interface StudyMoreItem extends StudyLink {}

export interface StudyMoreSection {
  title: string;
  items: StudyMoreItem[];
  href?: string;
}