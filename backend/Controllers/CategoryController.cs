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
    public class CategoryController : ControllerBase
    {
        private readonly BudgetTrackerContext _context;

        public CategoryController(BudgetTrackerContext context)
        {
            _context = context;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            var categoryDTOs = await _context.Categories
                .Select(c => new CategoryDTO
                {
                    ID = c.ID,
                    Name = c.Name
                })
                .ToListAsync();

            if (categoryDTOs.Count() > 0)
            {
                return categoryDTOs;
            }
            else
            {
                return NotFound(new { message = "Error: No Category records exist in the database" });
            }
        }

        // GET: api/Category/inc
        [HttpGet("inc")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategoriesInc()
        {
            var categoryDTOs = await _context.Categories
                .Include(c => c.Transactions)
                .Include(c => c.Budgets)
                .Select(c => new CategoryDTO
                {
                    ID = c.ID,
                    Name = c.Name,
                    Transactions = c.Transactions.Select(t => new TransactionDTO
                    {
                        ID = t.ID,
                        Description = t.Description,
                        Amount = t.Amount,
                        Type = t.Type,
                        Date = t.Date,
                        CategoryId = t.CategoryId
                    }).ToList(),
                    Budgets = c.Budgets.Select(b => new BudgetDTO
                    {
                        ID = b.ID,
                        Limit = b.Limit,
                        Dates = b.Dates,
                        CategoryId = b.CategoryId
                    }).ToList()
                })
                .ToListAsync();

            if (categoryDTOs.Count() > 0)
            {
                return categoryDTOs;
            }
            else
            {
                return NotFound(new { message = "Error: No Category records exist in the database" });
            }
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            var categoryDTO = await _context.Categories
                .Select(c => new CategoryDTO
                {
                    ID = c.ID,
                    Name = c.Name
                })
                .FirstOrDefaultAsync(c => c.ID == id);

            if (categoryDTO == null)
            {
                return NotFound(new { message = "Error: No Category records are shown" });
            }

            return categoryDTO;
        }

        // GET: api/Category/inc/5
        [HttpGet("inc/{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategoryInc(int id)
        {
            var categoryDTO = await _context.Categories
                .Include(c => c.Transactions)
                .Include(c => c.Budgets)
                .Select(c => new CategoryDTO
                {
                    ID = c.ID,
                    Name = c.Name,
                    Transactions = c.Transactions.Select(t => new TransactionDTO
                    {
                        ID = t.ID,
                        Description = t.Description,
                        Amount = t.Amount,
                        Type = t.Type,
                        Date = t.Date,
                        CategoryId = t.CategoryId
                    }).ToList(),
                    Budgets = c.Budgets.Select(b => new BudgetDTO
                    {
                        ID = b.ID,
                        Limit = b.Limit,
                        Dates = b.Dates,
                        CategoryId = b.CategoryId
                    }).ToList()
                })
                .FirstOrDefaultAsync(c => c.ID == id);

            if (categoryDTO == null)
            {
                return NotFound(new { message = "Error: That Category was not found in the database." });
            }

            return categoryDTO;
        }

        // PUT: api/Category/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CategoryDTO categoryDTO)
        {
            if (id != categoryDTO.ID)
            {
                return BadRequest(new { message = "Error: Category ID mismatch." });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categoryToUpdate = await _context.Categories.FindAsync(id);
            if (categoryToUpdate == null)
            {
                return NotFound(new { message = "Error: That Category was not found in the database." });
            }

            categoryToUpdate.ID = categoryDTO.ID;
            categoryToUpdate.Name = categoryDTO.Name;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return Conflict(new { message = "Concurrency Error: Category has been Removed." });
                }
                else
                {
                    return Conflict(new { message = "Concurrency Error: The record you attempted to edit was modified by another user after you got the original value. Your edit operation was canceled." });
                }
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Error: Unable to update the Category record." });
            }
        }

        // POST: api/Category
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> PostCategory(CategoryDTO categoryDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Category category = new Category
            {
                Name = categoryDTO.Name
            };

            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                categoryDTO.ID = category.ID;

                return CreatedAtAction(nameof(GetCategory), new { id = category.ID }, categoryDTO);
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Error: Unable to create the Category record." });
            }
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Delete Error: Category has already been removed." });
            }
            try
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException dex)
            {
                if (dex.InnerException != null && dex.InnerException.Message.Contains("FOREIGN KEY constraint failed"))
                {
                    return BadRequest(new { message = "Delete Error: Unable to delete the Category because it has related Transaction or Budget records." });
                }
                else
                {
                    return BadRequest(new { message = "Delete Error: Unable to delete the Category record." });
                }
            }
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.ID == id);
        }
    }
}