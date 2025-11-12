package com.milsabores.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private String productId;
    private String productName;
    private String category;
    private String userId;
    private String userName;
    private Integer rating;
    private String comment;
    private Float sentimentScore;
    private List<String> imageUrls;
      private String usuario;
    private String texto;
}
