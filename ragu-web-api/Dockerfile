# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app
    
# Copy csproj and restore as distinct layers
COPY *.sln .
COPY Ragu.WebApi/*.csproj Ragu.WebApi/
COPY Ragu.Services/*.csproj Ragu.Services/
COPY Ragu.InfraStructure/*.csproj Ragu.InfraStructure/
COPY Ragu.Core/*.csproj Ragu.Core/
COPY Ragu.Tests/*.csproj Ragu.Tests/
RUN dotnet restore "Ragu.WebApi/Ragu.WebApi.csproj"
    
# Copy everything else and build
COPY Ragu.WebApi/. ./Ragu.WebApi/
COPY Ragu.Services/. ./Ragu.Services/
COPY Ragu.InfraStructure/. ./Ragu.InfraStructure/
COPY Ragu.Core/. ./Ragu.Core/
COPY Ragu.Tests/. ./Ragu.Tests/
RUN dotnet publish -c Release -o out
    
# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Ragu.WebApi.dll"]