import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Modelo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    data: string;

    @Column({ type: 'timestamp'})
    fecha: Date;
}