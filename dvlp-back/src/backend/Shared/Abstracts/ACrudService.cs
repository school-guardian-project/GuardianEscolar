using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Shared.Interfaces;

namespace backend.Shared.Abstracts;

public abstract class ACrudService<TEntity, TResponseDto, TRequestDto> : ICrudService<TResponseDto, TRequestDto, Guid> where TEntity : BaseEntity
{
    // el nombre de las variables con "_", representan que son variables privadas.
    // no afectan el codigo el tener eso, es por uso de c#
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    // Inyectamos los atributos en el constructor
    public ACrudService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public List<TResponseDto> FindAll()
    {
        var entities = _context.Set<TEntity>().Where(e => e.status != "inactive").ToList();

        return _mapper.Map<List<TResponseDto>>(entities);
    }

    public TResponseDto FindById(Guid id)
    {
        var entity = _context.Set<TEntity>().Find(id);
        if (entity is null)
        {
            throw new Exception("Not found");
        }
        return _mapper.Map<TResponseDto>(entity);
    }

    public TResponseDto Save(TRequestDto dto)
    {
        var entity = _mapper.Map<TEntity>(dto);
        entity.status = "active";
        _context.Set<TEntity>().Add(entity);
        _context.SaveChanges();
        return _mapper.Map<TResponseDto>(entity);
    }

    public TResponseDto Update(Guid id, TRequestDto dto)
    {
        var entity = _context.Set<TEntity>().Find(id);
        if (entity != null)
        {
            _mapper.Map(dto, entity);
            entity.id = id;
            _context.SaveChanges();
            return _mapper.Map<TResponseDto>(entity);
        } 
        else
        {
            throw new Exception("Not found");
        }
    }

    public TResponseDto UpdatePartial(Guid id, TRequestDto dto)
    {
        var entity = _context.Set<TEntity>().Find(id);
        if (entity != null)
        {
            _mapper.Map(dto, entity);
            entity.id = id;
            _context.SaveChanges();
            return _mapper.Map<TResponseDto>(entity);
        } 
        else
        {
            throw new Exception("Not found");
        }
    }

    public void Delete(Guid id)
    {
        var entity = _context.Set<TEntity>().Find(id);
        if (entity != null)
        {
            _context.Set<TEntity>().Remove(entity);
            _context.SaveChanges();
        }
        else
        {
            throw new Exception("Not found");
        }
    }

    public void DeletePartial(Guid id)
    {
        var entity = _context.Set<TEntity>().Find(id);
        if (entity != null)
        {
            entity.status = "inactive";
            _context.SaveChanges();
        }
        else
        {
            throw new Exception("Not found");
        }
    }
}