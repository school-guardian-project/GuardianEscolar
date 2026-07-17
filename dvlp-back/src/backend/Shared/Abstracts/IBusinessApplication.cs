namespace backend.Shared.Abstracts;

public interface IBusinessApplication<TRequest, TResponse>
{ 
    Task<List<TResponse>> FindAll();
    
    Task<TResponse> Create(TRequest dto);
}