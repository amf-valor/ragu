USE Ragu;
GO

INSERT INTO [ragu].dbo.Customers
(
    [Name],
    [Street],
    [StreetNumber],
    [City],
    [Neighborhood],
    [PhoneNumber]
)
VALUES
(
    'alan',
    'rua ernesto evans',
    578,
    'São Paulo',
    'São miguel',
    11986254104
)

DECLARE @CustomerId INT = @@identity;

INSERT INTO [ragu].[dbo].[Orders]
(
    [OwnerId]
    ,[DeliveryTax]
    ,[IsPaid]
    ,[BookedAt]
) 
VALUES
(
    @CustomerId,
    4.0,
    0,
    GETDATE()
)

DECLARE @OrdersId INT = @@identity

INSERT INTO [ragu].[dbo].[Products]
(
    [Name]
    ,[Price]
)
VALUES
(
    'feijoada',
    10.0
)

DECLARE @ProductsId INT = @@identity

INSERT INTO [ragu].[dbo].[OrderProduct]
(
    OrdersId,
    ProductsId
)
VALUES
(
    @OrdersId,
    @ProductsId
)

SELECT * FROM Customers
SELECT * FROM Orders
SELECT * FROM Products
SELECT * FROM OrderProduct