from django.db import models

class Task(models.Model):
    TODO = 'todo'
    DONE = 'done'
    
    STATUS_CHOICES = {
        (TODO, 'todo'),
        (DONE, 'done'),
    }
    
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=TODO)