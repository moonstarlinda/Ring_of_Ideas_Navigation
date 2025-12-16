export interface Project {
    id: number;
    title: string;
    subtitle: string;
    color: string;
    description?: string;
    url?: string;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    color: string;
}