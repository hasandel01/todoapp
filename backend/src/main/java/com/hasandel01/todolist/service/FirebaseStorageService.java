package com.hasandel01.todolist.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.auth.oauth2.GoogleCredentials;
import com.hasandel01.todolist.model.User;
import com.hasandel01.todolist.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;

@Service
public class FirebaseStorageService {

    private final Storage storage;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public FirebaseStorageService(UserDetailsService userDetailsService, UserRepository userRepository) {
        this.storage = initializeFirebase();
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    private Storage initializeFirebase() {
        try {
            ClassPathResource resource = new ClassPathResource("todoapplication-ef2d3-firebase-adminsdk-fbsvc-50d2c7e4d2.json");
            GoogleCredentials credentials = GoogleCredentials.fromStream(resource.getInputStream());

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(credentials)
                    .setStorageBucket("todoapplication-ef2d3.firebasestorage.app")
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
            return StorageClient.getInstance().bucket().getStorage();
        } catch (IOException e) {
            throw new RuntimeException("Firebase initialization failed: " + e.getMessage(), e);
        }
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String bucketName = "todoapplication-ef2d3.firebasestorage.app";
        String fileName = Objects.requireNonNull(file.getOriginalFilename());

        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName)
                .setContentType(file.getContentType())
                .build();
        Blob blob = storage.create(blobInfo, file.getInputStream());

        String downloadToken = java.util.UUID.randomUUID().toString();
        blob.toBuilder().setMetadata(Map.of("firebaseStorageDownloadTokens", downloadToken)).build().update();

        String publicUrl = "https://firebasestorage.googleapis.com/v0/b/" + bucketName + "/o/"
                + URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                + "?alt=media&token=" + downloadToken;

        User user = (User) userDetailsService.loadUserByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName());
        user.setProfilePictureUrl(publicUrl);
        userRepository.save(user);

        return publicUrl;
    }

}
