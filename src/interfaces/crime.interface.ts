export interface Crime {
  id: number;
  camera: {
    name: string;
  };
  user_id: number;
  created_at: string;
  status_id: number;
  description?: string;
}
