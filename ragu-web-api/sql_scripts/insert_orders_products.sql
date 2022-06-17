
INSERT INTO [ragu].[dbo].[Orders]
    (
      [CustomerName]
      ,[DeliveryTax]
      ,[IsPaid]
      ,[BookedAt]
    ) 
VALUES
    (
        'alan',
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

SELECT * FROM Orders
SELECT * FROM Products
SELECT * FROM OrderProduct