package com.build.vacante.domain.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import java.util.UUID;
import java.util.Date;
import java.time.Instant;

@Entity
@Table(name="vacantes")
public class Vacante{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id", updatable = false, nullable = false)
    private UUID id;

    @Column(name ="puesto", nullable = false)
    private String puesto;

    @Column(name ="requisitos", nullable = true, length = 2000)
    private String requisitos;

    @Column(name ="empresa", nullable = false)
    private String empresa;

    @Column(name ="modalidad", nullable = false)
    private String modalidad;

    @Column(name ="fecha_vto", nullable = true)
    private Date fecha_vto;

    @Enumerated(EnumType.STRING)
    @Column(name="estado_vacante", nullable = false)
    private EstadoVacante estado;

    @Enumerated(EnumType.STRING)
    @Column(name="prioridad_vacante", nullable = false)
    private PrioridadVacante prioridad;

    @Column( name ="created", updatable=false, nullable = false)
    private Instant created;

    @Column( name ="last_updated", updatable=true, nullable = false)
    private Instant last_updated;

    //CONSTRUCTOR

    protected Vacante() {
        // Requerido por JPA.
    }

    public Vacante (String puesto, String requisitos, String empresa, String modalidad, Date fecha_vto, EstadoVacante estado, PrioridadVacante prioridad) {
        this.puesto = puesto;
        this.requisitos = requisitos;
        this.empresa = empresa;
        this.modalidad = modalidad;
        this.fecha_vto = fecha_vto;
        this.estado = estado;
        this.prioridad = prioridad;
        this.created = Instant.now();
        this.last_updated = Instant.now();
        //this.id = UUID.randomUUID();
    }

    //GETTERS AND SETTERS

    public UUID getId() {
        return id;
    }

    public String getPuesto() {
        return puesto;
    }
    
    public String getRequisitos() {
        return requisitos;
    }

    public String getEmpresa() {
        return empresa;
    }
    
    public Date getFecha_vto() {
        return fecha_vto;
    }

    public EstadoVacante getEstado() {
        return estado;
    }

    public PrioridadVacante getPrioridad() {
        return prioridad;
    }

    public Instant getCreated() {
        return created;
    }

    public Instant getLast_updated() {
        return last_updated;
    }
    public String getModalidad() {
        return modalidad;
    }

    /*public void setId(UUID id) {
        this.id = id;
    }*/

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }


    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public void setFecha_vto(Date fecha_vto) {
        this.fecha_vto = fecha_vto;
    }

    public void setEstado(EstadoVacante estado) {
        this.estado = estado;
    }

    public void setPrioridad(PrioridadVacante prioridad) {
        this.prioridad = prioridad;
    }

    public void setLast_updated(Instant last_updated) {
        this.last_updated = last_updated;
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null || getClass() != obj.getClass())  return false;
        Vacante vacante = (Vacante) obj;
        return id.equals(vacante.id);
    }

    @Override
    public String toString() {
        return "Vacante{" +
            "id=" + id +
            ", puesto='" + puesto + '\'' +
            ", requisitos='" + requisitos + '\'' +
            ", empresa='" + empresa + '\'' +
            ", modalidad='" + modalidad + '\'' +
            ", fecha_vto=" + fecha_vto +
            ", estado=" + estado +
            ", prioridad=" + prioridad +
            ", created=" + created +
            ", last_updated=" + last_updated +
            '}';
    }
}