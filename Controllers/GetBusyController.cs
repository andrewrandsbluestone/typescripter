﻿using System.ComponentModel;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace typescripter.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GetBusyController : ControllerBase
    {
        private static bool Busy = false;

        [HttpGet("pollForResult")]
        public int PollForResult()
        {
           return Busy ? 0: 1;
        }

        [HttpPost("Block")]
        public async Task<IActionResult> Block(Model model)
        {
            await Task.Delay(5000);

            return new OkObjectResult(model.Name);
        }

        [HttpPost("Poll")]
        public IActionResult Poll(Model model)
        {
            Task.Run(() =>
            {
                Busy = true;
                LongRunningJob(10000);
                Busy = false;
            });

            return new OkObjectResult(model.Name);
        }
        
        private void LongRunningJob(int milliseconds)
        {
            var sw = Stopwatch.StartNew();
            
            while (sw.ElapsedMilliseconds < milliseconds)
                Thread.SpinWait(1000);
        }
    }
}