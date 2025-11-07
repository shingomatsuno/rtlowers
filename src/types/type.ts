export interface ImageData {
  url: string;
  height: number;
  width: number;
}

export interface SnsData {
  fieldId: "sns";
  xAccount?: string;
  youtubeChannel?: string;
  instagramAccount?: string;
  ticktockAccount?: string;
}

export interface MemberData {
  fieldId: "member";
  name: string;
  part: string[];
  xAccount?: string;
  instagramAccount?: string;
}

export interface AboutData {
  fieldId: "about";
  image: ImageData;
  bio: string;
  members: MemberData[];
  simpleFlag: boolean;
}

export interface MovieData {
  fieldId: "movie";
  url: string;
}

export interface BandData {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  icon: ImageData;
  description: string;
  heroImages: ImageData[];
  about: AboutData;
  movies: MovieData[];
  sns: SnsData;
  keywords?: string;
}

export interface Eyecatch {
  url: string;
  height: number;
  width: number;
}

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
}

export interface Actor {
  fieldId: string;
  actor: string;
}

export interface EventDetail {
  fieldId: string;
  eventDate: string;
  eventOpenTime: string;
  eventStartTime: string;
  venue: string;
  actors: Actor[];
  drink: number;
  ticket: number;
  todayTicket: number;
}

export interface Announce {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  eyecatch: Eyecatch;
  category: Category;
  eventDetail: EventDetail;
}
