using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activity;
using CRM.Domain.Entities.Lead;
using CRM.Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly DatabaseContext dbContext;
        private readonly IConfiguration config;
        public AppointmentRepository(
            DatabaseContext dbContext,
            IConfiguration config)
        {
            this.dbContext = dbContext;
            this.config = config;
        }

        public Appointment Create(Appointment entity)
        {
            var entry = this.dbContext.Appointment.Add(entity);
            return entry.Entity;
        }

        public Appointment Update(Appointment entity)
        {
            var entry = this.dbContext.Appointment.Update(entity);
            return entry.Entity;
        }

        public Appointment Delete(Appointment entity)
        {
            var entry = this.dbContext.Appointment.Remove(entity);
            return entry.Entity;
        }

        public Appointment Get(Guid Id)
        {
            var entity = this.dbContext.Appointment.FirstOrDefault(e => e.Id == Id) ?? throw new NotFoundException();
            return entity;
        }
    }
}
