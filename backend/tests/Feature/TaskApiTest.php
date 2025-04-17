<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test getting all tasks.
     */


    public function test_can_get_all_tasks(){
  
Task::factory()->create();

    
 $response = $this->getJson('/api/tasks');

 
    $response->assertStatus(200);
   
    $this->assertNotEmpty($response->json());
}

    /**
     * Test creating a new task.
     */
    public function test_can_create_task()
    {

        $image = UploadedFile::fake()->image('task.jpg');
        
       
        $taskData = [
            'title' => 'New Test Task',
            'description' => 'This is a test task',
            'status' => 1,
            'image' => $image
        ];

        $response = $this->postJson('/api/tasks', $taskData);

      
        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'New Test Task']);
        
      
        $this->assertDatabaseHas('tasks', ['title' => 'New Test Task']);
    }

    /**
     * Test updating an existing task.
     */
    public function test_can_update_task()
    {
        // Arrange: Create a task to update
        $task = Task::factory()->create([
            'title' => 'Original Task',
            'description' => 'Original description',
            'status' => 0
        ]);
    
    
        $updatedData = [
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 1
        ];
    
        
        $response = $this->patchJson("/api/tasks/{$task->id}", $updatedData);
    
    
        $response->assertStatus(200);
        
 
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => 'Updated Task', 'status' => 1]);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id, 'title' => 'Original Task']);
    }

    /**
     * Test deleting a task.
     */
    public function test_can_delete_task()
    {
     
        $task = Task::factory()->create();

   
        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /**
     * Test getting a task that doesn't exist returns 404.
     */
    public function test_getting_nonexistent_task_returns_404()
    {
        // Act: Try to get a nonexistent task (using GET instead of PUT)
        $response = $this->getJson('/api/tasks/999');

        // Assert: Check that we get a 404 response
        $response->assertStatus(404);
    }

    /**
     * Test validation when creating a task.
     */
    public function test_validation_when_creating_task()
    {
        
        $response = $this->postJson('/api/tasks', [
            'description' => 'Missing title field',
            'status' => 1
        ]);

       
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title']);
    }
    
    /**
     * Test status validation when creating a task.
     */
    public function test_status_validation_when_creating_task()
    {
      
        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'description' => 'Test description',
            'status' => 2 
        ]);



        // $response->assertStatus(422)





        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['status']);
    }
}