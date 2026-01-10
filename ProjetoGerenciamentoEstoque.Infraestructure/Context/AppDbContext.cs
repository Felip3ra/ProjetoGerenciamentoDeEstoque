using Microsoft.EntityFrameworkCore;
using ProjetoGerenciamentoEstoque.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Infraestructure.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Movement> Movements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(u => u.Id);

                entity.HasIndex(u => u.Email)
                    .IsUnique()
                    .HasFilter("[Email] IS NOT NULL");

                entity.HasIndex(u => u.Status);
                entity.HasIndex(u => u.HasAccess);
                entity.HasIndex(u => u.Profile);
            });

            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("Items");
                entity.HasKey(i => i.Id);

                entity.HasIndex(i => i.SerialNumber)
                    .IsUnique();

                entity.HasOne(i => i.CurrentUser)
                    .WithMany(u => u.Items)
                    .HasForeignKey(i => i.CurrentUserId);

                entity.HasIndex(i => i.StatusItem);
                entity.HasIndex(i => i.Category);
                entity.HasIndex(i => i.CurrentUserId);
            });

            modelBuilder.Entity<Movement>(entity =>
            {
                entity.ToTable("Movements");
                entity.HasKey(m => m.Id);

                entity.HasOne(m => m.Item)
                    .WithMany(i => i.Movements)
                    .HasForeignKey(m => m.ItemId);

                entity.HasOne(m => m.FromUser)
                    .WithMany(u => u.MovementsFrom)
                    .HasForeignKey(m => m.FromUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.ToUser)
                    .WithMany(u => u.MovementsTo)
                    .HasForeignKey(m => m.ToUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(m => m.ItemId);
                entity.HasIndex(m => m.MovementDateTime);
                entity.HasIndex(m => m.MovementType);
            });
        }
    }
}
