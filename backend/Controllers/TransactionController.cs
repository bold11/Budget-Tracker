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
    public class TransactionController : ControllerBase
    {
        private readonly BudgetTrackerContext _context;

        public TransactionController(BudgetTrackerContext context)
        {
            _context = context;
        }

        // GET: api/Transaction
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetTransactions()
        {
            var transactionDTOs = await _context.Transactions
                .Include(t => t.Category)
                .Select(t => new TransactionDTO
                {
                    ID = t.ID,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    Date = t.Date,
                    CategoryId = t.CategoryId,
                    CategoryDTO = t.Category == null ? null : new CategoryDTO
                    {
                        ID = t.Category.ID,
                        Name = t.Category.Name
                    }
                })
                .ToListAsync();

            if (transactionDTOs.Count() > 0)
            {
                return transactionDTOs;
            }
            else
            {
                return NotFound(new { message = "Error: No Transaction records exist in the database" });
            }
        }

        // GET: api/Transaction/ByCategory/5
        [HttpGet("ByCategory/{id}")]
        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetTransactionsByCategory(int id)
        {
            var transactionDTOs = await _context.Transactions
                .Include(t => t.Category)
                .Select(t => new TransactionDTO
                {
                    ID = t.ID,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    Date = t.Date,
                    CategoryId = t.CategoryId,
                    CategoryDTO = t.Category == null ? null : new CategoryDTO
                    {
                        ID = t.Category.ID,
                        Name = t.Category.Name
                    }
                })
                .Where(t => t.CategoryId == id)
                .ToListAsync();

            if (transactionDTOs.Count() > 0)
            {
                return transactionDTOs;
            }
            else
            {
                return NotFound(new { message = "Error: No Transactions found for the specified Category." });
            }
        }

        // GET: api/Transaction/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDTO>> GetTransaction(int id)
        {
            var transactionDTO = await _context.Transactions
                .Include(t => t.Category)
                .Select(t => new TransactionDTO
                {
                    ID = t.ID,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    Date = t.Date,
                    CategoryId = t.CategoryId,
                    CategoryDTO = t.Category == null ? null : new CategoryDTO
                    {
                        ID = t.Category.ID,
                        Name = t.Category.Name
                    }
                })
                .FirstOrDefaultAsync(t => t.ID == id);

            if (transactionDTO == null)
            {
                return NotFound(new { message = "Error: No Transaction records are shown" });
            }

            return transactionDTO;
        }

        // PUT: api/Transaction/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, TransactionDTO transactionDTO)
        {
            if (id != transactionDTO.ID)
            {
                return BadRequest(new { message = "Error: Transaction ID mismatch." });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transactionToUpdate = await _context.Transactions.FindAsync(id);
            if (transactionToUpdate == null)
            {
                return NotFound(new { message = "Error: That Transaction was not found in the database." });
            }

            transactionToUpdate.ID = transactionDTO.ID;
            transactionToUpdate.Description = transactionDTO.Description;
            transactionToUpdate.Amount = transactionDTO.Amount;
            transactionToUpdate.Type = transactionDTO.Type;
            transactionToUpdate.Date = transactionDTO.Date;
            transactionToUpdate.CategoryId = transactionDTO.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return Conflict(new { message = "Concurrency Error: Transaction has been Removed." });
                }
                else
                {
                    return Conflict(new { message = "Concurrency Error: The record you attempted to edit was modified by another user after you got the original value. Your edit operation was canceled." });
                }
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Error: Unable to update the Transaction record." });
            }
        }

        // POST: api/Transaction
        [HttpPost]
        public async Task<ActionResult<TransactionDTO>> PostTransaction(TransactionDTO transactionDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Transaction transaction = new Transaction
            {
                Description = transactionDTO.Description,
                Amount = transactionDTO.Amount,
                Type = transactionDTO.Type,
                Date = transactionDTO.Date,
                CategoryId = transactionDTO.CategoryId
            };

            try
            {
                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                transactionDTO.ID = transaction.ID;

                return CreatedAtAction(nameof(GetTransaction), new { id = transaction.ID }, transactionDTO);
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Error: Unable to create the Transaction record." });
            }
        }

        // DELETE: api/Transaction/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound(new { message = "Delete Error: Transaction has already been removed." });
            }
            try
            {
                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Delete Error: Unable to delete the Transaction record." });
            }
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.ID == id);
        }
    }
}