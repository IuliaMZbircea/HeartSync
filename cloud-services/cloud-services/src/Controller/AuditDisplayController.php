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

        $auditTables = array_filter($tables, fn($name) => str_starts_with($name, 'audit_') && str_ends_with($name, '_audit'));

        $entityNames = array_map(
            fn($table) => str_replace(['audit_', '_audit'], '', $table),
            $auditTables
        );

        return $this->json([
            'available_entities' => array_values($entityNames)
        ]);
    }

    #[Route('/{entity}', name: 'audit_modifications_entity', methods: ['GET'])]
    public function getAuditForEntity(string $entity): JsonResponse
    {
        $schemaManager = $this->connection->createSchemaManager();
        $tables = $schemaManager->listTableNames();

        // Caută tabelul audit corespunzător (ex: audit_alarm_audit)
        $matchedTable = null;
        foreach ($tables as $table) {
            if (strtolower($table) === 'audit_' . strtolower($entity) . '_audit') {
                $matchedTable = $table;
                break;
            }
        }

        if (!$matchedTable) {
            return $this->json(['error' => "Audit table for '$entity' not found"], 404);
        }

        try {
            $entries = $this->connection->fetchAllAssociative("
                SELECT * FROM `$matchedTable` ORDER BY created_at DESC LIMIT 10
            ");
            return $this->json([
                strtolower($entity) => $entries
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
