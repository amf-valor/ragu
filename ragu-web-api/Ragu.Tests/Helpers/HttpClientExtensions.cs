using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace Ragu.Tests.Helpers;

public static class HttpClientExtensions
{
    public static async Task<T?> GetAsJsonToObject<T>(this HttpClient httpClient, string uri)
    {
        AddHeaderApplicationJson(httpClient);
        var responseMessage = await httpClient.GetAsync(uri);
        responseMessage.EnsureSuccessStatusCode();

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

    public static Task<HttpResponseMessage> GetAsJson(this HttpClient httpClient, string uri)
    {
        AddHeaderApplicationJson(httpClient);
        return httpClient.GetAsync(uri);
    }

    private static void AddHeaderApplicationJson(HttpClient httpClient)
    {
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }
}