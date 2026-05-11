using BudgetTrackerWebAPI.Data;
using BudgetTrackerWebAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BudgetTrackerWebAPI.Data
{

    public static class BudgetTrackerInitializer
    {

        public static void Initialize(IServiceProvider serviceProvider,
            bool DeleteDatabase = false,
            bool UseMigrations = true,
            bool SeedSampleData = true)
        {

            using (var context = new BudgetTrackerContext(
                serviceProvider.GetRequiredService<DbContextOptions<BudgetTrackerContext>>()))
            {

                #region Prepare Database
                try
                {
                    if (DeleteDatabase || !context.Database.CanConnect())
                    {
                        context.Database.EnsureDeleted();

                        if (UseMigrations)
                            context.Database.Migrate();
                        else
                            context.Database.EnsureCreated();
                    }
                    else
                    {
                        if (UseMigrations)
                            context.Database.Migrate();
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex.GetBaseException().Message);
                }
                #endregion

                #region Seed Data

                if (!SeedSampleData) return;

                try
                {

                    // Categories
                    if (!context.Categories.Any())
                    {
                        var categories = new List<Category> {
                            new Category { Name = "Salary"},
                            new Category { Name = "Food"},
                            new Category { Name = "Rent"},
                            new Category { Name = "Transport"},
                            new Category { Name = "Entertainment"}
                        };
                        context.Categories.AddRange(categories);
                        context.SaveChanges();
                    }

                    // Transactions
                    if (!context.Transactions.Any())
                    {

                        int salaryId        = context.Categories.First(c => c.Name == "Salary").ID;
                        int foodId          = context.Categories.First(c => c.Name == "Food").ID;
                        int rentId          = context.Categories.First(c => c.Name == "Rent").ID;
                        int transportId     = context.Categories.First(c => c.Name == "Transport").ID;
                        int entertainmentId = context.Categories.First(c => c.Name == "Entertainment").ID;

                        var transactions = new List<Transaction> {

                            // ── November 2025 ──────────────────────────────────────
                            new Transaction {
                                Description = "Monthly Salary",
                                Amount      = 3200.00m,
                                Type        = "income",
                                Date        = new DateTime(2025, 11, 1),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Rent Payment",
                                Amount      = 900.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 1),
                                CategoryId  = rentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 97.30m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 3),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Bus Pass",
                                Amount      = 45.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 4),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Netflix",
                                Amount      = 15.99m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 5),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Lunch with Colleagues",
                                Amount      = 42.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 7),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Freelance Invoice",
                                Amount      = 600.00m,
                                Type        = "income",
                                Date        = new DateTime(2025, 11, 10),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Gas",
                                Amount      = 58.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 12),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Pharmacy",
                                Amount      = 24.50m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 14),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Cinema Tickets",
                                Amount      = 32.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 15),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 83.75m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 19),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Uber Rides",
                                Amount      = 28.50m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 21),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Spotify",
                                Amount      = 9.99m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 22),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Side Gig Payment",
                                Amount      = 250.00m,
                                Type        = "income",
                                Date        = new DateTime(2025, 11, 25),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Restaurant Dinner",
                                Amount      = 67.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 11, 28),
                                CategoryId  = foodId
                            },

                            // ── December 2025 ─────────────────────────────────────
                            new Transaction {
                                Description = "Monthly Salary",
                                Amount      = 3200.00m,
                                Type        = "income",
                                Date        = new DateTime(2025, 12, 1),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Rent Payment",
                                Amount      = 900.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 1),
                                CategoryId  = rentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 120.40m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 3),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Bus Pass",
                                Amount      = 45.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 4),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Year-End Bonus",
                                Amount      = 1200.00m,
                                Type        = "income",
                                Date        = new DateTime(2025, 12, 5),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Netflix",
                                Amount      = 15.99m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 5),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Holiday Party Tickets",
                                Amount      = 55.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 10),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 145.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 15),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Gas",
                                Amount      = 63.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 16),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Freelance Invoice",
                                Amount      = 900.00m,
                                Type        = "income",
                                Date        = new DateTime(2025, 12, 18),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Restaurant Dinner",
                                Amount      = 88.50m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 20),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Spotify",
                                Amount      = 9.99m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 22),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Uber Rides",
                                Amount      = 41.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 24),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 102.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 27),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "New Year Concert",
                                Amount      = 75.00m,
                                Type        = "expense",
                                Date        = new DateTime(2025, 12, 31),
                                CategoryId  = entertainmentId
                            },

                            // ── January 2026 ──────────────────────────────────────
                            new Transaction {
                                Description = "Monthly Salary",
                                Amount      = 3200.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 1, 1),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Rent Payment",
                                Amount      = 900.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 1),
                                CategoryId  = rentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 88.20m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 4),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Bus Pass",
                                Amount      = 45.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 5),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Netflix",
                                Amount      = 15.99m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 5),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Coffee Shop",
                                Amount      = 18.50m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 8),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Freelance Invoice",
                                Amount      = 480.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 1, 12),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Gas",
                                Amount      = 54.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 13),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 76.90m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 17),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Spotify",
                                Amount      = 9.99m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 18),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Uber Rides",
                                Amount      = 33.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 20),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Restaurant Dinner",
                                Amount      = 52.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 23),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Side Gig Payment",
                                Amount      = 320.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 1, 27),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Bowling Night",
                                Amount      = 38.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 1, 29),
                                CategoryId  = entertainmentId
                            },

                            // ── February 2026 (original data kept) ────────────────
                            new Transaction {
                                Description = "Monthly Salary",
                                Amount      = 3200.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 2, 1),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Rent Payment",
                                Amount      = 900.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 2, 1),
                                CategoryId  = rentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 92.50m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 2, 5),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Bus Pass",
                                Amount      = 45.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 2, 6),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Spotify",
                                Amount      = 9.99m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 2, 8),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Freelance Project",
                                Amount      = 750.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 2, 14),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Restaurant Dinner",
                                Amount      = 58.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 2, 14),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Gas",
                                Amount      = 55.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 2, 18),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Netflix",
                                Amount      = 15.99m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 2, 20),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Bonus",
                                Amount      = 400.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 2, 28),
                                CategoryId  = salaryId
                            },

                            // ── March 2026 (original data kept) ───────────────────
                            new Transaction {
                                Description = "Monthly Salary",
                                Amount      = 3200.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 3, 1),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Rent Payment",
                                Amount      = 900.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 3, 1),
                                CategoryId  = rentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 110.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 3, 4),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Uber Rides",
                                Amount      = 32.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 3, 7),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Concert Tickets",
                                Amount      = 120.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 3, 10),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Side Gig Payment",
                                Amount      = 300.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 3, 15),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Coffee Shop",
                                Amount      = 22.50m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 3, 17),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Gas",
                                Amount      = 62.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 3, 20),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Netflix",
                                Amount      = 15.99m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 3, 20),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Tax Refund",
                                Amount      = 850.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 3, 28),
                                CategoryId  = salaryId
                            },

                            // ── April 2026 (original data kept) ───────────────────
                            new Transaction {
                                Description = "Monthly Salary",
                                Amount      = 3200.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 4, 1),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Rent Payment",
                                Amount      = 900.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 4, 1),
                                CategoryId  = rentId
                            },
                            new Transaction {
                                Description = "Grocery Run",
                                Amount      = 85.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 4, 2),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Netflix",
                                Amount      = 15.99m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 4, 2),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Freelance Project",
                                Amount      = 500.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 4, 3),
                                CategoryId  = salaryId
                            },
                            new Transaction {
                                Description = "Gas",
                                Amount      = 60.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 4, 3),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Restaurant Lunch",
                                Amount      = 34.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 4, 5),
                                CategoryId  = foodId
                            },
                            new Transaction {
                                Description = "Movie Night",
                                Amount      = 28.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 4, 6),
                                CategoryId  = entertainmentId
                            },
                            new Transaction {
                                Description = "Bus Pass",
                                Amount      = 45.00m,
                                Type        = "expense",
                                Date        = new DateTime(2026, 4, 7),
                                CategoryId  = transportId
                            },
                            new Transaction {
                                Description = "Part-time Work",
                                Amount      = 620.00m,
                                Type        = "income",
                                Date        = new DateTime(2026, 4, 9),
                                CategoryId  = salaryId
                            }
                        };
                        context.Transactions.AddRange(transactions);
                        context.SaveChanges();
                    }

                    // Budgets
                    if (!context.Budgets.Any())
                    {

                        int foodId          = context.Categories.First(c => c.Name == "Food").ID;
                        int rentId          = context.Categories.First(c => c.Name == "Rent").ID;
                        int transportId     = context.Categories.First(c => c.Name == "Transport").ID;
                        int entertainmentId = context.Categories.First(c => c.Name == "Entertainment").ID;

                        var budgets = new List<Budget> {
                            new Budget {
                                Limit      = 1000.00m,
                                Dates      = new DateTime(2026, 4, 1),
                                CategoryId = rentId
                            },
                            new Budget {
                                Limit      = 300.00m,
                                Dates      = new DateTime(2026, 4, 1),
                                CategoryId = foodId
                            },
                            new Budget {
                                Limit      = 150.00m,
                                Dates      = new DateTime(2026, 4, 1),
                                CategoryId = transportId
                            },
                            new Budget {
                                Limit      = 100.00m,
                                Dates      = new DateTime(2026, 4, 1),
                                CategoryId = entertainmentId
                            }
                        };
                        context.Budgets.AddRange(budgets);
                        context.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex.GetBaseException().Message);
                }

                #endregion
            }
        }
    }
}