package com.roadwatch.app.camera

import android.graphics.Bitmap
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.*

@Composable
fun rememberCameraLauncher(
    onImageCaptured: (Bitmap?) -> Unit
): () -> Unit {

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        onImageCaptured(bitmap)
    }

    return {
        launcher.launch(null)
    }
}