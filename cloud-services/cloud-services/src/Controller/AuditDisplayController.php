<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/audit/modifications')]
class AuditDisplayController extends AbstractController
{
    public function __construct(private Connection $connection) {}

    #[Route('', name: 'audit_modifications_index', methods: ['GET'])]
    public function listAuditTables(): JsonResponse
    {
        $schemaManager = $this->connection->createSchemaManager();
        $tables = $schemaManager->listTableNames();

        $auditTables = array_filter($tables, fn($name) => str_starts_with($name, 'audit_'));
        $entityNames = array_values(array_map(fn($table) => str_replace('audit_', '', $table), $auditTables));

        
        return $this->json(['available_entities' => $entityNames]);
    }

    #[Route('/{entity}', name: 'audit_modifications_entity', methods: ['GET'])]
    public function getAuditForEntity(string $entity): JsonResponse
    {
        $tableName = 'audit_' . strtolower($entity) . '_audit';

        $schemaManager = $this->connection->createSchemaManager();
        $tables = $schemaManager->listTableNames();

        if (!in_array($tableName, $tables)) {
            return $this->json(['error' => "Audit table for '$entity' not found"], 404);
        }

        try {
            $entries = $this->connection->fetchAllAssociative("
                SELECT * FROM `$tableName` ORDER BY created_at DESC LIMIT 10
            ");
            return $this->json([$entity => $entries]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
