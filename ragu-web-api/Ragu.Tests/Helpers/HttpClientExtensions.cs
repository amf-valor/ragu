using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Ragu.Tests.Helpers;

public static class HttpClientExtensions
{
    public static async Task<T?> GetAsJsonToObject<T>(this HttpClient httpClient, string uri)
    {
        AddHeaderApplicationJson(httpClient);
        var responseMessage = await httpClient.GetAsync(uri);
        return await GetPayloadAsObject<T>(responseMessage);
    }

    private static async Task<T?> GetPayloadAsObject<T>(HttpResponseMessage responseMessage)
    {
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

    public static async Task<T?> PostAsJsonToObject<T>(this HttpClient httpClient, string uri, object body)
    {
        var responseMessage = await httpClient.PostAsync(uri, CreateJsonContent(body));
        return await GetPayloadAsObject<T>(responseMessage);
    }

    private static StringContent CreateJsonContent(object body)
        => new(JsonSerializer.Serialize(body), Encoding.UTF8, MediaTypeNames.Application.Json);

    public static Task<HttpResponseMessage> PostAsJson(this HttpClient httpClient, string uri, object body)
        => httpClient.PostAsync(uri, CreateJsonContent(body));

    private static void AddHeaderApplicationJson(HttpClient httpClient)
    {
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }
}