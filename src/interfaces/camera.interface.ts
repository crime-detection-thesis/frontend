export interface Camera {
    id: number;
    name: string;
    rtsp_url: string;
    active: boolean;
}

export interface CreateCamera {
    name: string;
    rtsp_url: string;
    surveillance_center?: number;
}