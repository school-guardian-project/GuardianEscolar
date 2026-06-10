namespace backend.Shared.Interfaces;

public interface ICrudService<TResponseDto, TRequestDto, TId>
{
    List<TResponseDto> FindAll();

    TResponseDto FindById(TId id);
    
    TResponseDto Save(TRequestDto dto);
    
    void Delete(TId id);
}