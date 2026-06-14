using backend.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Shared.Abstracts;

public abstract class ACrudController<TResponseDto, TRequestDto> : ControllerBase
{
    protected readonly ICrudService<TResponseDto, TRequestDto, Guid> _service;

    protected ACrudController(ICrudService<TResponseDto, TRequestDto, Guid> service)
    {
        _service = service;
    }

    // ActionResult, significa que el metodo va devolver una respuesta HTTP.
    
    [HttpGet]
    public ActionResult<List<TResponseDto>> FindAll()
    {
        return Ok(_service.FindAll());
    }
    
    [HttpGet("{id}")]
    public ActionResult<TResponseDto> FindById(Guid id)
    {
        return Ok(_service.FindById(id));
    }
    
    [HttpPost]
    public ActionResult<TResponseDto> Save(TRequestDto dto)
    {
        return Ok(_service.Save(dto));
    }

    [HttpPut("{id}")]
    public ActionResult<TResponseDto> Update(Guid id, TRequestDto dto)
    {
        return Ok(_service.Update(id, dto));
    }
    
    [HttpPatch("{id}")]
    public ActionResult<TResponseDto> UpdatePartial(Guid id, TRequestDto dto)
    {
        return Ok(_service.UpdatePartial(id, dto));
    }
    
    [HttpDelete("{id}")]
    public ActionResult Delete(Guid id)
    {
        {
            _service.Delete(id);
            // No retorna nada, ejecuta la peticion, pero no devuelve nada.
            return NoContent(); 
        }
    }
    
    [HttpDelete("soft/{id}")]
    public ActionResult DeletePartial(Guid id)
    {
        {
            _service.DeletePartial(id);
            return NoContent(); 
        }
    }
}