using System.Diagnostics;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.UserManagement.Api.Controller;

[ApiController]
[Route("api/student")]
[Tags("student")]
public class StudentController : ControllerBase
{
    private readonly StudentService _studentService;

    public StudentController(StudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpPost]
    public async Task<ActionResult<StudentResponseDto>> Create([FromBody] StudentRequestDto dto)
    {
        var result = await _studentService.Create(dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<StudentResponseDto>>> FindAll()
    {
        var sw = Stopwatch.StartNew();
        var result = await _studentService.FindAll();
        Console.WriteLine($"Controller: {sw.ElapsedMilliseconds} ms");
        return Ok(result);
    }
}