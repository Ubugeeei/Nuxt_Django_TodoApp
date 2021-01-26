from rest_framework import serializers

from .models import Task, Task

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'description', 'status')