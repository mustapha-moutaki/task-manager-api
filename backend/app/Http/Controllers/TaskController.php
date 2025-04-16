<?php
namespace App\Http\Controllers;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query();
   
        if ($request->has('status')) {
            $status = $request->status === '1' ? true : false;
            $query->where('status', $status);
        }
       
        $query->orderBy('created_at', 'desc');
   
        $tasks = $query->get();
        return response()->json(['tasks' => $tasks]);
    }
   
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
            'image' => 'required|image|max:2048',
            'tags' => 'nullable|string|max:255', // Add validation for tags
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $task = new Task();
        $task->title = $request->title;
        $task->description = $request->description;
        $task->status = $request->status ?? false;
        $task->tags = $request->tags; // Save tags
        
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('task-images', 'public');
            $task->image_path = 'storage/' . $imagePath;
        }
        
        $task->save();
        return response()->json(['task' => $task, 'message' => 'Task created successfully'], 201);
    }
    
    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json(['task' => $task]);
    }
    
    public function update(Request $request, Task $task)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
            'tags' => 'nullable|string|max:255', // Add validation for tags
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $task->status = $request->input('status');
        $task->tags = $request->input('tags'); // Update tags
        
        // Only update image_path if it's provided
        if ($request->has('image_path')) {
            $task->image_path = $request->input('image_path');
        }
   
        $task->save();
   
        return response()->json(['task' => $task, 'message' => 'Task updated successfully']);
    }
    
    public function updateWithImage(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
            'image' => 'required|image|max:2048',
            'tags' => 'nullable|string|max:255', // Add validation for tags
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $task = Task::findOrFail($id);
        $task->title = $request->title;
        $task->description = $request->description;
        $task->status = $request->status ?? false;
        $task->tags = $request->tags; // Update tags
        
        // Delete old image if it exists
        if ($task->image_path) {
            $oldPath = str_replace('storage/', 'public/', $task->image_path);
            Storage::delete($oldPath);
        }
        
        // Save new image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('task-images', 'public');
            $task->image_path = 'storage/' . $imagePath;
        }
        
        $task->save();
        return response()->json(['task' => $task, 'message' => 'Task updated successfully']);
    }
   
    public function toggleStatus($id)
    {
        $task = Task::findOrFail($id);
        $task->status = !$task->status;
        $task->save();
        return response()->json(['task' => $task, 'message' => 'Task status updated successfully']);
    }
    
    public function destroy(Task $task)
    {
        // Delete the associated image if it exists
        if ($task->image_path) {
            $imagePath = str_replace('storage/', 'public/', $task->image_path);
            Storage::delete($imagePath);
        }
        
        // Delete the task
        $task->delete();
     
        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
}