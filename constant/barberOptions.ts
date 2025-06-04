import { MyBarberSVG, MyBarberSVG2 } from '../public/MyBarberSVG'
export type BarberData = {
  barber_id: number;
  name?: string;
  first_name?: string;
  profile_pic?: string | React.ReactNode;
  description?: string;
}

export type FetchedBarberData = BarberData


export const STATIC_BARBER_OPTIONS: FetchedBarberData[] = [
  {
    barber_id: 0,
    name: 'Any professional',
    profile_pic: MyBarberSVG,
    description: 'for maximum availability',
  },
  {
    barber_id: -1,
    name: 'Select professional per service',
    profile_pic: MyBarberSVG2,
  }
];
