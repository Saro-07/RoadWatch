package com.roadwatch.app.ui.tickets

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

/**
 * Screen for viewing all reported issues/tickets
 */
@Composable
fun TicketsScreen() {
    LazyColumn {
        items(5) { index ->
            Text("Ticket #${index + 1}")
        }
    }
}
