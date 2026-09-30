def test_issues_crud_and_validation(client):
    # 1. Setup project
    p_res = client.post('/api/projects', json={'name': 'Issue Project'})
    pid = p_res.json['id']

    # 2. List empty issues
    res = client.get(f'/api/projects/{pid}/issues')
    assert res.status_code == 200
    assert res.json == []

    # 3. Create issue with defaults
    create_res = client.post(
        f'/api/projects/{pid}/issues',
        json={'title': 'First Bug', 'description': 'Bug details'},
    )
    assert create_res.status_code == 201
    issue = create_res.json
    assert issue['id'] is not None
    assert issue['project_id'] == pid
    assert issue['title'] == 'First Bug'
    assert issue['status'] == 'Open'
    assert issue['priority'] == 'Medium'
    iid = issue['id']

    # 4. Get single issue
    get_res = client.get(f'/api/issues/{iid}')
    assert get_res.status_code == 200
    assert get_res.json['id'] == iid
    assert get_res.json['project_id'] == pid

    # 5. Update issue (PUT full replacement)
    update_res = client.put(
        f'/api/issues/{iid}',
        json={
            'title': 'First Bug Resolved',
            'description': 'Resolved details',
            'status': 'Resolved',
            'priority': 'Low',
        },
    )
    assert update_res.status_code == 200
    assert update_res.json['title'] == 'First Bug Resolved'
    assert update_res.json['status'] == 'Resolved'
    assert update_res.json['priority'] == 'Low'
    assert update_res.json['project_id'] == pid

    # 6. Delete issue
    del_res = client.delete(f'/api/issues/{iid}')
    assert del_res.status_code == 204
    assert client.get(f'/api/issues/{iid}').status_code == 404


def test_issue_validation_errors(client):
    p_res = client.post('/api/projects', json={'name': 'Validation Project'})
    pid = p_res.json['id']

    # Missing/empty title
    assert client.post(f'/api/projects/{pid}/issues', json={'title': ''}).status_code == 400
    assert client.post(f'/api/projects/{pid}/issues', json={'title': '   '}).status_code == 400

    # Title too long
    assert client.post(f'/api/projects/{pid}/issues', json={'title': 'x' * 201}).status_code == 400

    # Invalid status
    res_status = client.post(
        f'/api/projects/{pid}/issues', json={'title': 'Valid', 'status': 'Closed'}
    )
    assert res_status.status_code == 400

    # Invalid priority
    res_priority = client.post(
        f'/api/projects/{pid}/issues', json={'title': 'Valid', 'priority': 'Extreme'}
    )
    assert res_priority.status_code == 400

    # Nonexistent project
    assert client.post('/api/projects/999/issues', json={'title': 'Valid'}).status_code == 404


def test_issue_filtering_and_search(client):
    p_res = client.post('/api/projects', json={'name': 'Search Project'})
    pid = p_res.json['id']

    client.post(
        f'/api/projects/{pid}/issues',
        json={'title': 'UI Overflow on mobile', 'status': 'Open', 'priority': 'High'},
    )
    client.post(
        f'/api/projects/{pid}/issues',
        json={'title': 'Foreign key constraint violation', 'status': 'In Progress', 'priority': 'Medium'},
    )
    client.post(
        f'/api/projects/{pid}/issues',
        json={'title': 'Typo in error message', 'status': 'Resolved', 'priority': 'Low'},
    )

    # Filter by status
    res_open = client.get(f'/api/projects/{pid}/issues?status=Open')
    assert len(res_open.json) == 1
    assert res_open.json[0]['title'] == 'UI Overflow on mobile'

    res_resolved = client.get(f'/api/projects/{pid}/issues?status=Resolved')
    assert len(res_resolved.json) == 1
    assert res_resolved.json[0]['title'] == 'Typo in error message'

    # Search by title (case-insensitive substring)
    res_search = client.get(f'/api/projects/{pid}/issues?search=CONSTRAINT')
    assert len(res_search.json) == 1
    assert res_search.json[0]['title'] == 'Foreign key constraint violation'

    # Search with no matches
    res_empty = client.get(f'/api/projects/{pid}/issues?search=nonexistent')
    assert len(res_empty.json) == 0

    # Combined filter and search
    res_combined = client.get(f'/api/projects/{pid}/issues?status=Open&search=overflow')
    assert len(res_combined.json) == 1
