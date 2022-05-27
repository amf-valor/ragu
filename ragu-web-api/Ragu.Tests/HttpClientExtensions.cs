using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace Ragu.Tests;

public static class HttpClientExtensions
{
    public static async Task<T?> GetAsJson<T>(this HttpClient httpClient, string uri)
    {
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        var responseMessage = await httpClient.GetAsync(uri);
        var payload = await responseMessage.Content.ReadAsStringAsync();

        if (string.IsNullOrEmpty(payload))
            return default;

        var serializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        return JsonSerializer.Deserialize<T>(payload, serializeOptions);
    }
}