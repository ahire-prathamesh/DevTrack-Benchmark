def test_dashboard_nonexistent_project(client):
    res = client.get('/api/projects/999/dashboard')
    assert res.status_code == 404
    assert res.json['error']['code'] == 'NOT_FOUND'


def test_dashboard_empty_project(client):
    p_res = client.post('/api/projects', json={'name': 'Empty Project'})
    pid = p_res.json['id']

    res = client.get(f'/api/projects/{pid}/dashboard')
    assert res.status_code == 200
    data = res.json

    assert data['project']['id'] == pid
    assert data['project']['name'] == 'Empty Project'

    # Task metrics
    assert data['task_metrics']['total'] == 0
    assert data['task_metrics']['by_status'] == {
        'Todo': 0,
        'In Progress': 0,
        'Done': 0,
    }
    assert data['recent_tasks'] == []

    # Issue metrics
    assert data['issue_metrics']['total'] == 0
    assert data['issue_metrics']['by_status'] == {
        'Open': 0,
        'In Progress': 0,
        'Resolved': 0,
    }
    assert data['recent_issues'] == []


def test_dashboard_metrics_and_limit_5(client):
    p_res = client.post('/api/projects', json={'name': 'Metrics Project'})
    pid = p_res.json['id']

    # Create 7 tasks: 3 Todo, 2 In Progress, 2 Done
    for i in range(3):
        client.post(f'/api/projects/{pid}/tasks', json={'title': f'Todo Task {i}', 'status': 'Todo'})
    for i in range(2):
        client.post(f'/api/projects/{pid}/tasks', json={'title': f'Progress Task {i}', 'status': 'In Progress'})
    for i in range(2):
        client.post(f'/api/projects/{pid}/tasks', json={'title': f'Done Task {i}', 'status': 'Done'})

    # Create 6 issues: 2 Open, 3 In Progress, 1 Resolved
    for i in range(2):
        client.post(f'/api/projects/{pid}/issues', json={'title': f'Open Bug {i}', 'status': 'Open'})
    for i in range(3):
        client.post(f'/api/projects/{pid}/issues', json={'title': f'Progress Bug {i}', 'status': 'In Progress'})
    for i in range(1):
        client.post(f'/api/projects/{pid}/issues', json={'title': f'Resolved Bug {i}', 'status': 'Resolved'})

    res = client.get(f'/api/projects/{pid}/dashboard')
    assert res.status_code == 200
    data = res.json

    # Task aggregations
    assert data['task_metrics']['total'] == 7
    assert data['task_metrics']['by_status']['Todo'] == 3
    assert data['task_metrics']['by_status']['In Progress'] == 2
    assert data['task_metrics']['by_status']['Done'] == 2

    # Issue aggregations
    assert data['issue_metrics']['total'] == 6
    assert data['issue_metrics']['by_status']['Open'] == 2
    assert data['issue_metrics']['by_status']['In Progress'] == 3
    assert data['issue_metrics']['by_status']['Resolved'] == 1

    # Max 5 recent items, newest first
    assert len(data['recent_tasks']) == 5
    assert len(data['recent_issues']) == 5

    # Verify task order: last created task was 'Done Task 1'
    assert data['recent_tasks'][0]['title'] == 'Done Task 1'
    # Verify issue order: last created issue was 'Resolved Bug 0'
    assert data['recent_issues'][0]['title'] == 'Resolved Bug 0'
