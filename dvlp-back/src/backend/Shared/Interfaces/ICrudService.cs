namespace backend.Shared.Interfaces;

public interface ICrudService<TResponseDto, TRequestDto, TGuid>
{
    List<TResponseDto> FindAll();

    TResponseDto FindById(TGuid id);
    
    TResponseDto Save(TRequestDto dto);

    TResponseDto Update(TGuid id, TRequestDto dto);

    TResponseDto UpdatePartial(TGuid id, TRequestDto dto);
    
    void Delete(TGuid id);

    void DeletePartial(TGuid id, TRequestDto dto);
}