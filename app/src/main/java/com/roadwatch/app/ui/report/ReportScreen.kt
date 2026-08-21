package com.roadwatch.app.ui.report

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * Screen for reporting a new road issue
 */
@Composable
fun ReportScreen() {
    val description = remember { mutableStateOf("") }
    val severity = remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Report a Road Issue")
        Spacer(modifier = Modifier.height(16.dp))
        
        TextField(
            value = description.value,
            onValueChange = { description.value = it },
            label = { Text("Description") }
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        TextField(
            value = severity.value,
            onValueChange = { severity.value = it },
            label = { Text("Severity (Low/Medium/High)") }
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(onClick = { /* Handle report submission */ }) {
            Text("Submit Report")
        }
    }
}
