using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BudgetTrackerWebAPI.Data;
using BudgetTrackerWebAPI.Models;

namespace BudgetTrackerWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly BudgetTrackerContext _context;

        public BudgetController(BudgetTrackerContext context)
        {
            _context = context;
        }

        // GET: api/Budget
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetDTO>>> GetBudgets()
        {
            var budgetDTOs = await _context.Budgets
                .Include(b => b.Category)
                .Select(b => new BudgetDTO
                {
                    ID = b.ID,
                    Limit = b.Limit,
                    Dates = b.Dates,
                    CategoryId = b.CategoryId,
                    CategoryDTO = b.Category == null ? null : new CategoryDTO
                    {
                        ID = b.Category.ID,
                        Name = b.Category.Name
                    }
                })
                .ToListAsync();

            if (budgetDTOs.Count() > 0)
            {
                return budgetDTOs;
            }
            else
            {
                return NotFound(new { message = "Error: No Budget records exist in the database" });
            }
        }

        // GET: api/Budget/ByCategory/5
        [HttpGet("ByCategory/{id}")]
        public async Task<ActionResult<IEnumerable<BudgetDTO>>> GetBudgetsByCategory(int id)
        {
            var budgetDTOs = await _context.Budgets
                .Include(b => b.Category)
                .Select(b => new BudgetDTO
                {
                    ID = b.ID,
                    Limit = b.Limit,
                    Dates = b.Dates,
                    CategoryId = b.CategoryId,
                    CategoryDTO = b.Category == null ? null : new CategoryDTO
                    {
                        ID = b.Category.ID,
                        Name = b.Category.Name
                    }
                })
                .Where(b => b.CategoryId == id)
                .ToListAsync();

            if (budgetDTOs.Count() > 0)
            {
                return budgetDTOs;
            }
            else
            {
                return NotFound(new { message = "Error: No Budgets found for the specified Category." });
            }
        }

        // GET: api/Budget/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetDTO>> GetBudget(int id)
        {
            var budgetDTO = await _context.Budgets
                .Include(b => b.Category)
                .Select(b => new BudgetDTO
                {
                    ID = b.ID,
                    Limit = b.Limit,
                    Dates = b.Dates,
                    CategoryId = b.CategoryId,
                    CategoryDTO = b.Category == null ? null : new CategoryDTO
                    {
                        ID = b.Category.ID,
                        Name = b.Category.Name
                    }
                })
                .FirstOrDefaultAsync(b => b.ID == id);

            if (budgetDTO == null)
            {
                return NotFound(new { message = "Error: No Budget records are shown" });
            }

            return budgetDTO;
        }

        // PUT: api/Budget/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget(int id, BudgetDTO budgetDTO)
        {
            if (id != budgetDTO.ID)
            {
                return BadRequest(new { message = "Error: Budget ID mismatch." });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var budgetToUpdate = await _context.Budgets.FindAsync(id);
            if (budgetToUpdate == null)
            {
                return NotFound(new { message = "Error: That Budget was not found in the database." });
            }

            budgetToUpdate.ID = budgetDTO.ID;
            budgetToUpdate.Limit = budgetDTO.Limit;
            budgetToUpdate.Dates = budgetDTO.Dates;
            budgetToUpdate.CategoryId = budgetDTO.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetExists(id))
                {
                    return Conflict(new { message = "Concurrency Error: Budget has been Removed." });
                }
                else
                {
                    return Conflict(new { message = "Concurrency Error: The record you attempted to edit was modified by another user after you got the original value. Your edit operation was canceled." });
                }
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Error: Unable to update the Budget record." });
            }
        }

        // POST: api/Budget
        [HttpPost]
        public async Task<ActionResult<BudgetDTO>> PostBudget(BudgetDTO budgetDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Budget budget = new Budget
            {
                Limit = budgetDTO.Limit,
                Dates = budgetDTO.Dates,
                CategoryId = budgetDTO.CategoryId
            };

            try
            {
                _context.Budgets.Add(budget);
                await _context.SaveChangesAsync();

                budgetDTO.ID = budget.ID;

                return CreatedAtAction(nameof(GetBudget), new { id = budget.ID }, budgetDTO);
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Error: Unable to create the Budget record." });
            }
        }

        // DELETE: api/Budget/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound(new { message = "Delete Error: Budget has already been removed." });
            }
            try
            {
                _context.Budgets.Remove(budget);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException dex)
            {
                if (dex.InnerException != null && dex.InnerException.Message.Contains("FOREIGN KEY constraint failed"))
                {
                    return BadRequest(new { message = "Delete Error: Unable to delete the Budget because it has related records." });
                }
                else
                {
                    return BadRequest(new { message = "Delete Error: Unable to delete the Budget record." });
                }
            }
        }

        private bool BudgetExists(int id)
        {
            return _context.Budgets.Any(e => e.ID == id);
        }
    }
}