interface Service {
  id: string;
  name: string;
  description: string;
  time: number;
  price: number;
  popular?: boolean;
  specialty?: boolean;
  category: number;
  [key: string]: unknown;
}

export default Service