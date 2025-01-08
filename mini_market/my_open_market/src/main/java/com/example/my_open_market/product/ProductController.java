package com.example.my_open_market.product;

import com.example.my_open_market.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Value("${spring.servlet.multipart.location}")
    private String filePath;

    @GetMapping("/read_img/{fileName}")
    public ResponseEntity<byte[]> readImg(@PathVariable("fileName") String fileName) {
        ResponseEntity<byte[]> result = null;
        File file = new File(filePath + fileName);

        //응답 헤더정보 저장 객체
        HttpHeaders headers = new HttpHeaders();
        try {
            //전송하는 데이터의 마임 타입 설정
            headers.add("Content-Type", Files.probeContentType(file.toPath()));
            result = new ResponseEntity<byte[]>(
                    FileCopyUtils.copyToByteArray(file), headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    @PostMapping("/board/post")
    public Map postProduct(ProductDto productDto) {
        String fileName = productDto.getMultipartFile().getOriginalFilename();
        File newFile = new File(filePath + fileName);
        boolean isImgUploaded = false;

        try {
            productDto.getMultipartFile().transferTo(newFile);
            productDto.setImg(fileName);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = new User(authentication.getName(), "", "", "");
            productDto.setId(user);
            productService.saveProduct(productDto);
            isImgUploaded = true;
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        Map map = new HashMap();
        map.put("isImgUploaded", isImgUploaded);
        return map;
    }

    @GetMapping("/board/list")
    public Map getAllPosts() {
        Map map = new HashMap();
        map.put("list", productService.getAllProducts());
        return map;
    }

    @GetMapping("/board/productdetail/{productNumber}")
    public Map productDetail(@PathVariable("productNumber") int productNumber) {
        Map map = new HashMap();
        ProductDto productDto = productService.getProductByNum(productNumber);
        map.put("productDto", productDto);
        return map;
    }

    @PutMapping("/board/productdetail/{productNumber}")
    public Map updateProductDetail(@PathVariable("productNumber") int productNumber, @RequestBody ProductDto productDto) {
        System.out.println(productDto);
        Map map = new HashMap();
        ProductDto prevProductDto = productService.getProductByNum(productNumber);
        prevProductDto.setProductName(productDto.getProductName());
        prevProductDto.setProductPrice(productDto.getProductPrice());
        prevProductDto.setProductQuantity(productDto.getProductQuantity());
        prevProductDto.setProductDescription(productDto.getProductDescription());
        boolean isDetailChanged = true;

        try {
            productService.saveProduct(prevProductDto);
        } catch (Exception e) {
            System.out.println(e);
            isDetailChanged = false;
        }
        map.put("isDetailChanged", isDetailChanged);
        return map;
    }

    @DeleteMapping("/board/productdetail/{productNumber}")
    public Map delete(@PathVariable("productNumber") int num) {
        Map map = new HashMap();
        boolean isDeleted = true;

        try {
            productService.deleteProductByNum(num);
        } catch (Exception e) {
            System.out.println(e);
            isDeleted = false;
        }
        map.put("isDeleted", isDeleted);
        return map;
    }
}
