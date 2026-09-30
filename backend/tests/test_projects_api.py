def test_list_projects_empty(client):
    res = client.get('/api/projects')
    assert res.status_code == 200
    assert res.json == []


def test_create_project_success(client):
    payload = {'name': 'Project Alpha', 'description': 'Initial project'}
    res = client.post('/api/projects', json=payload)
    assert res.status_code == 201
    data = res.json
    assert data['id'] is not None
    assert data['name'] == 'Project Alpha'
    assert data['description'] == 'Initial project'
    assert data['created_at'] is not None


def test_create_project_validation_failure(client):
    # Missing name
    res = client.post('/api/projects', json={'description': 'No name'})
    assert res.status_code == 400
    assert res.json['error']['code'] == 'VALIDATION_ERROR'

    # Empty name
    res = client.post('/api/projects', json={'name': ''})
    assert res.status_code == 400
    assert res.json['error']['code'] == 'VALIDATION_ERROR'

    # Whitespace-only name
    res = client.post('/api/projects', json={'name': '   '})
    assert res.status_code == 400
    assert res.json['error']['code'] == 'VALIDATION_ERROR'

    # Name too long (> 100 characters)
    res = client.post('/api/projects', json={'name': 'a' * 101})
    assert res.status_code == 400
    assert res.json['error']['code'] == 'VALIDATION_ERROR'


def test_get_project_details(client):
    create_res = client.post('/api/projects', json={'name': 'Project Beta'})
    pid = create_res.json['id']

    res = client.get(f'/api/projects/{pid}')
    assert res.status_code == 200
    assert res.json['id'] == pid
    assert res.json['name'] == 'Project Beta'


def test_get_nonexistent_project(client):
    res = client.get('/api/projects/999')
    assert res.status_code == 404
    assert res.json['error']['code'] == 'NOT_FOUND'


def test_update_project(client):
    create_res = client.post('/api/projects', json={'name': 'Old Name', 'description': 'Old Desc'})
    pid = create_res.json['id']

    res = client.put(f'/api/projects/{pid}', json={'name': 'New Name', 'description': 'New Desc'})
    assert res.status_code == 200
    assert res.json['name'] == 'New Name'
    assert res.json['description'] == 'New Desc'

    # Verify update persisted
    get_res = client.get(f'/api/projects/{pid}')
    assert get_res.json['name'] == 'New Name'


def test_update_project_validation_failure(client):
    create_res = client.post('/api/projects', json={'name': 'Valid Name'})
    pid = create_res.json['id']

    # Update with empty name
    res = client.put(f'/api/projects/{pid}', json={'name': '   '})
    assert res.status_code == 400
    assert res.json['error']['code'] == 'VALIDATION_ERROR'

    # Update nonexistent project
    res = client.put('/api/projects/999', json={'name': 'Something'})
    assert res.status_code == 404


def test_delete_project(client):
    create_res = client.post('/api/projects', json={'name': 'To Delete'})
    pid = create_res.json['id']

    res = client.delete(f'/api/projects/{pid}')
    assert res.status_code == 204

    # Verify deleted
    get_res = client.get(f'/api/projects/{pid}')
    assert get_res.status_code == 404


def test_delete_nonexistent_project(client):
    res = client.delete('/api/projects/999')
    assert res.status_code == 404
