namespace backend.Shared.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }

        public String Message { get; set; } = string.Empty;

        public T? Data { get; set; }

        public List<String> Errors { get; set; } = new();
    }
}
