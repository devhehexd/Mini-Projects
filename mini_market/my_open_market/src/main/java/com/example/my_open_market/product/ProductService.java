package com.example.my_open_market.product;

import com.example.my_open_market.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductDao productDao;

    public ProductDto saveProduct(ProductDto productDto) {
        Product entity = productDao.save(new Product(productDto.getProductNumber(),
                productDto.getProductName(), productDto.getProductDescription(),
                productDto.getProductPostDate(), productDto.getProductPrice(),
                productDto.getProductQuantity(), productDto.getImg(), productDto.getId()));

        return new ProductDto(entity.getProductNumber(), entity.getProductName(),
                entity.getProductDescription(), entity.getProductPostDate(),
                entity.getProductPrice(), entity.getProductQuantity(), entity.getImg(),
                entity.getId(), null);
    }

    public ProductDto getProductByNum(int productNumber) {
        Product product = productDao.findById(productNumber).orElse(null);
        if (product != null) {
            return new ProductDto(product.getProductNumber(), product.getProductName(),
                    product.getProductDescription(), product.getProductPostDate(),
                    product.getProductPrice(), product.getProductQuantity(), product.getImg(),
                    product.getId(), null);
        }
        return null;
    }

    public List<ProductDto> getProductBySeller(String id) {
        List<Product> tmp = productDao.findById(new User(id, "", "", ""));
        List<ProductDto> productList = new ArrayList<>();

        for (Product entity : tmp) {
            productList.add(new ProductDto(entity.getProductNumber(), entity.getProductName(),
                    entity.getProductDescription(), entity.getProductPostDate(),
                    entity.getProductPrice(), entity.getProductQuantity(), entity.getImg(),
                    entity.getId(), null));
        }
        return productList;
    }

    public List<ProductDto> getProductByPrice(int p1, int p2) {
        List<Product> tmp = productDao.findByProductPriceBetween(p1, p2);
        List<ProductDto> productList = new ArrayList<>();

        for (Product entity : tmp) {
            productList.add(new ProductDto(entity.getProductNumber(), entity.getProductName(),
                    entity.getProductDescription(), entity.getProductPostDate(),
                    entity.getProductPrice(), entity.getProductQuantity(), entity.getImg(),
                    entity.getId(), null));
        }
        return productList;
    }

    public List<ProductDto> getByProductName(String productName) {
        List<Product> tmp = productDao.findByProductNameLike("%" + productName + "%");
        List<ProductDto> productList = new ArrayList<>();

        for (Product entity : tmp) {
            productList.add(new ProductDto(entity.getProductNumber(), entity.getProductName(),
                    entity.getProductDescription(), entity.getProductPostDate(),
                    entity.getProductPrice(), entity.getProductQuantity(), entity.getImg(),
                    entity.getId(), null));
        }
        return productList;
    }

    public List<ProductDto> getAllProducts() {
        List<Product> tmp = productDao.findAll();
        List<ProductDto> productList = new ArrayList<>();

        for (Product entity : tmp) {
            productList.add(new ProductDto(entity.getProductNumber(), entity.getProductName(),
                    entity.getProductDescription(), entity.getProductPostDate(),
                    entity.getProductPrice(), entity.getProductQuantity(), entity.getImg(),
                    entity.getId(), null));
        }
        return productList;
    }

    public void deleteProductByNum(int productNumber) {
        productDao.deleteById(productNumber);
    }
}
