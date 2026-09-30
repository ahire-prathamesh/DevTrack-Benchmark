def test_tasks_crud_and_validation(client):
    # 1. Setup project
    p_res = client.post('/api/projects', json={'name': 'Task Project'})
    pid = p_res.json['id']

    # 2. List empty tasks
    res = client.get(f'/api/projects/{pid}/tasks')
    assert res.status_code == 200
    assert res.json == []

    # 3. Create task with defaults
    create_res = client.post(
        f'/api/projects/{pid}/tasks',
        json={'title': 'First Task', 'description': 'Task details'},
    )
    assert create_res.status_code == 201
    task = create_res.json
    assert task['id'] is not None
    assert task['project_id'] == pid
    assert task['title'] == 'First Task'
    assert task['status'] == 'Todo'
    assert task['priority'] == 'Medium'
    tid = task['id']

    # 4. Get single task
    get_res = client.get(f'/api/tasks/{tid}')
    assert get_res.status_code == 200
    assert get_res.json['id'] == tid
    assert get_res.json['project_id'] == pid

    # 5. Update task (PUT full replacement)
    update_res = client.put(
        f'/api/tasks/{tid}',
        json={
            'title': 'First Task Updated',
            'description': 'Updated details',
            'status': 'In Progress',
            'priority': 'High',
        },
    )
    assert update_res.status_code == 200
    assert update_res.json['title'] == 'First Task Updated'
    assert update_res.json['status'] == 'In Progress'
    assert update_res.json['priority'] == 'High'
    assert update_res.json['project_id'] == pid

    # 6. Delete task
    del_res = client.delete(f'/api/tasks/{tid}')
    assert del_res.status_code == 204
    assert client.get(f'/api/tasks/{tid}').status_code == 404


def test_task_validation_errors(client):
    p_res = client.post('/api/projects', json={'name': 'Validation Project'})
    pid = p_res.json['id']

    # Missing/empty title
    assert client.post(f'/api/projects/{pid}/tasks', json={'title': ''}).status_code == 400
    assert client.post(f'/api/projects/{pid}/tasks', json={'title': '   '}).status_code == 400

    # Title too long
    assert client.post(f'/api/projects/{pid}/tasks', json={'title': 'x' * 201}).status_code == 400

    # Invalid status
    res_status = client.post(
        f'/api/projects/{pid}/tasks', json={'title': 'Valid', 'status': 'Unknown'}
    )
    assert res_status.status_code == 400

    # Invalid priority
    res_priority = client.post(
        f'/api/projects/{pid}/tasks', json={'title': 'Valid', 'priority': 'Extreme'}
    )
    assert res_priority.status_code == 400

    # Nonexistent project
    assert client.post('/api/projects/999/tasks', json={'title': 'Valid'}).status_code == 404


def test_task_filtering_and_search(client):
    p_res = client.post('/api/projects', json={'name': 'Search Project'})
    pid = p_res.json['id']

    client.post(
        f'/api/projects/{pid}/tasks',
        json={'title': 'Implement Authentication', 'status': 'Todo', 'priority': 'High'},
    )
    client.post(
        f'/api/projects/{pid}/tasks',
        json={'title': 'Fix login button styling', 'status': 'In Progress', 'priority': 'Medium'},
    )
    client.post(
        f'/api/projects/{pid}/tasks',
        json={'title': 'Database migration script', 'status': 'Done', 'priority': 'Low'},
    )

    # Filter by status
    res_todo = client.get(f'/api/projects/{pid}/tasks?status=Todo')
    assert len(res_todo.json) == 1
    assert res_todo.json[0]['title'] == 'Implement Authentication'

    res_in_prog = client.get(f'/api/projects/{pid}/tasks?status=In%20Progress')
    assert len(res_in_prog.json) == 1
    assert res_in_prog.json[0]['title'] == 'Fix login button styling'

    # Search by title (case-insensitive substring)
    res_search = client.get(f'/api/projects/{pid}/tasks?search=LOGIN')
    assert len(res_search.json) == 1
    assert res_search.json[0]['title'] == 'Fix login button styling'

    # Search with no matches
    res_empty = client.get(f'/api/projects/{pid}/tasks?search=nonexistent')
    assert len(res_empty.json) == 0

    # Combined filter and search
    res_combined = client.get(f'/api/projects/{pid}/tasks?status=Todo&search=auth')
    assert len(res_combined.json) == 1
