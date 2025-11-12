package com.milsabores.backend.repository;

import com.milsabores.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductoIdOrderByFechaDesc(Long productoId);
}
