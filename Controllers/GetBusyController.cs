using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
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
        private static readonly ConcurrentDictionary<Guid, bool> Busy = new ConcurrentDictionary<Guid, bool>();

        [HttpGet("pollForResult/{pollingToken}")]
        public bool PollForResult([FromRoute] string pollingToken)
        {
            var guid = new Guid(pollingToken);

            return Busy.TryGetValue(guid, out var value) && value;
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
            var guid = Guid.NewGuid();

            Task.Run(() =>
            {
                Busy.TryAdd(guid, true);
                LongRunningJob(10000);
                Busy.TryUpdate(guid, false, true);
            });

            return new OkObjectResult(guid.ToString());
        }
        
        private void LongRunningJob(int milliseconds)
        {
            var sw = Stopwatch.StartNew();
            
            while (sw.ElapsedMilliseconds < milliseconds)
                Thread.SpinWait(1000);
        }
    }
}