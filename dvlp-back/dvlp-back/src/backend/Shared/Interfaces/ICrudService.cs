namespace backend.Shared.Interfaces;

public interface ICrudService<TResponseDto, TRequestDto, Guid>
{
    List<TResponseDto> FindAll();

    TResponseDto FindById(Guid id);
    
    TResponseDto Save(TRequestDto dto);

    TResponseDto Update(Guid id, TRequestDto dto);

    TResponseDto UpdatePartial(Guid id, TRequestDto dto);
    
    void Delete(Guid id);

    void DeletePartial(Guid id);
}