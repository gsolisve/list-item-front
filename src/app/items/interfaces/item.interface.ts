export interface Item {
  id:         number;
  name:       string;
  quantity:   number;
  price:      number;
  status:     Status;
  category:   Category;
  expireDate: null;
  image:      string;
}

export interface Category {
  id:     number;
  name:   string;
  status: boolean;
  color:  string;
}

export interface Status {
  id:     number;
  name:   string;
  status: boolean;
}
