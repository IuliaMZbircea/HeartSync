<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250609134409 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_alarm_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_7a9b07579021c487bba1d7e91d857053_idx (type), INDEX object_id_7a9b07579021c487bba1d7e91d857053_idx (object_id), INDEX discriminator_7a9b07579021c487bba1d7e91d857053_idx (discriminator), INDEX transaction_hash_7a9b07579021c487bba1d7e91d857053_idx (transaction_hash), INDEX blame_id_7a9b07579021c487bba1d7e91d857053_idx (blame_id), INDEX created_at_7a9b07579021c487bba1d7e91d857053_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_allergy_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_ebeb2dc876e2f09777594c34e2da72a0_idx (type), INDEX object_id_ebeb2dc876e2f09777594c34e2da72a0_idx (object_id), INDEX discriminator_ebeb2dc876e2f09777594c34e2da72a0_idx (discriminator), INDEX transaction_hash_ebeb2dc876e2f09777594c34e2da72a0_idx (transaction_hash), INDEX blame_id_ebeb2dc876e2f09777594c34e2da72a0_idx (blame_id), INDEX created_at_ebeb2dc876e2f09777594c34e2da72a0_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_consultation_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_4a1ca08272f2d70960cfa506b8d8de8e_idx (type), INDEX object_id_4a1ca08272f2d70960cfa506b8d8de8e_idx (object_id), INDEX discriminator_4a1ca08272f2d70960cfa506b8d8de8e_idx (discriminator), INDEX transaction_hash_4a1ca08272f2d70960cfa506b8d8de8e_idx (transaction_hash), INDEX blame_id_4a1ca08272f2d70960cfa506b8d8de8e_idx (blame_id), INDEX created_at_4a1ca08272f2d70960cfa506b8d8de8e_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_disease_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_45195167a48a6b811384c60242b0ce93_idx (type), INDEX object_id_45195167a48a6b811384c60242b0ce93_idx (object_id), INDEX discriminator_45195167a48a6b811384c60242b0ce93_idx (discriminator), INDEX transaction_hash_45195167a48a6b811384c60242b0ce93_idx (transaction_hash), INDEX blame_id_45195167a48a6b811384c60242b0ce93_idx (blame_id), INDEX created_at_45195167a48a6b811384c60242b0ce93_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_doctor_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_5cb1af3eccd46f9dcb6b054a24d810dc_idx (type), INDEX object_id_5cb1af3eccd46f9dcb6b054a24d810dc_idx (object_id), INDEX discriminator_5cb1af3eccd46f9dcb6b054a24d810dc_idx (discriminator), INDEX transaction_hash_5cb1af3eccd46f9dcb6b054a24d810dc_idx (transaction_hash), INDEX blame_id_5cb1af3eccd46f9dcb6b054a24d810dc_idx (blame_id), INDEX created_at_5cb1af3eccd46f9dcb6b054a24d810dc_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_medical_letter_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_f5695167157ef00d8736caee71fba013_idx (type), INDEX object_id_f5695167157ef00d8736caee71fba013_idx (object_id), INDEX discriminator_f5695167157ef00d8736caee71fba013_idx (discriminator), INDEX transaction_hash_f5695167157ef00d8736caee71fba013_idx (transaction_hash), INDEX blame_id_f5695167157ef00d8736caee71fba013_idx (blame_id), INDEX created_at_f5695167157ef00d8736caee71fba013_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_medication_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_1b38c3d2f10b5b83feca531f12bfb075_idx (type), INDEX object_id_1b38c3d2f10b5b83feca531f12bfb075_idx (object_id), INDEX discriminator_1b38c3d2f10b5b83feca531f12bfb075_idx (discriminator), INDEX transaction_hash_1b38c3d2f10b5b83feca531f12bfb075_idx (transaction_hash), INDEX blame_id_1b38c3d2f10b5b83feca531f12bfb075_idx (blame_id), INDEX created_at_1b38c3d2f10b5b83feca531f12bfb075_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_patient_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_d959c716e64cc77df905e4b8a99eaf5e_idx (type), INDEX object_id_d959c716e64cc77df905e4b8a99eaf5e_idx (object_id), INDEX discriminator_d959c716e64cc77df905e4b8a99eaf5e_idx (discriminator), INDEX transaction_hash_d959c716e64cc77df905e4b8a99eaf5e_idx (transaction_hash), INDEX blame_id_d959c716e64cc77df905e4b8a99eaf5e_idx (blame_id), INDEX created_at_d959c716e64cc77df905e4b8a99eaf5e_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_prescription_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_5e37e6db156b83df9029d1007f6e6f98_idx (type), INDEX object_id_5e37e6db156b83df9029d1007f6e6f98_idx (object_id), INDEX discriminator_5e37e6db156b83df9029d1007f6e6f98_idx (discriminator), INDEX transaction_hash_5e37e6db156b83df9029d1007f6e6f98_idx (transaction_hash), INDEX blame_id_5e37e6db156b83df9029d1007f6e6f98_idx (blame_id), INDEX created_at_5e37e6db156b83df9029d1007f6e6f98_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_recommendation_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_71f488108db606f3f5c2ee6797197474_idx (type), INDEX object_id_71f488108db606f3f5c2ee6797197474_idx (object_id), INDEX discriminator_71f488108db606f3f5c2ee6797197474_idx (discriminator), INDEX transaction_hash_71f488108db606f3f5c2ee6797197474_idx (transaction_hash), INDEX blame_id_71f488108db606f3f5c2ee6797197474_idx (blame_id), INDEX created_at_71f488108db606f3f5c2ee6797197474_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_referral_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, discriminator VARCHAR(255) DEFAULT NULL, transaction_hash VARCHAR(40) DEFAULT NULL, diffs JSON DEFAULT NULL, blame_id VARCHAR(255) DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX type_f880639df268734cd75becbec4240531_idx (type), INDEX object_id_f880639df268734cd75becbec4240531_idx (object_id), INDEX discriminator_f880639df268734cd75becbec4240531_idx (discriminator), INDEX transaction_hash_f880639df268734cd75becbec4240531_idx (transaction_hash), INDEX blame_id_f880639df268734cd75becbec4240531_idx (blame_id), INDEX created_at_f880639df268734cd75becbec4240531_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_alarm
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_allergy
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_consultation
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_disease
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_doctor
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_medicalletter
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_medication
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_patient
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_prescription
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_recommendation
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_referral
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alarm CHANGE parameter parameter VARCHAR(255) NOT NULL, CHANGE condition_type condition_type VARCHAR(255) NOT NULL, CHANGE message message LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alarm RENAME INDEX fk_alarm_patient TO IDX_749F46DD6B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE severity severity VARCHAR(100) DEFAULT NULL, CHANGE reaction reaction LONGTEXT DEFAULT NULL, CHANGE notes notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy RENAME INDEX fk_allergy_patient TO IDX_CBB142B56B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE consultation DROP reason, DROP diagnosis_icd10, CHANGE symptoms symptoms LONGTEXT NOT NULL, CHANGE notes notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL, CHANGE current_medication_ids current_medication_ids LONGTEXT DEFAULT NULL, CHANGE medical_history_ids medical_history_ids LONGTEXT DEFAULT NULL, CHANGE family_history family_history LONGTEXT DEFAULT NULL, CHANGE diagnosis_ids diagnosis_ids LONGTEXT DEFAULT NULL, CHANGE referral_ids referral_ids LONGTEXT DEFAULT NULL, CHANGE prescription_ids prescription_ids LONGTEXT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease CHANGE type type VARCHAR(255) DEFAULT NULL, CHANGE description description LONGTEXT DEFAULT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL, CHANGE roles roles JSON NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor RENAME INDEX email TO UNIQ_1FC0F36AE7927C74
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_referral TO IDX_E55C59A53CCAA4B7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_patient TO IDX_E55C59A56B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_from_specialist TO IDX_E55C59A532440D8D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_to_doctor TO IDX_E55C59A5B6572C66
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_consultation TO IDX_E55C59A562FF6CDF
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication CHANGE dose dose VARCHAR(255) NOT NULL, CHANGE frequency frequency VARCHAR(255) NOT NULL, CHANGE route route VARCHAR(255) NOT NULL, CHANGE start_date start_date DATE DEFAULT NULL, CHANGE notes notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient CHANGE valid_account valid_account TINYINT(1) DEFAULT 1 NOT NULL, CHANGE sex sex VARCHAR(1) DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX email TO UNIQ_1ADAD7EBE7927C74
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX cnp TO UNIQ_1ADAD7EB1EAB9B7E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE prescription CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation CHANGE activity_type activity_type VARCHAR(255) NOT NULL, CHANGE additional_notes additional_notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral CHANGE type type VARCHAR(50) NOT NULL, CHANGE reason reason LONGTEXT NOT NULL, CHANGE is_resolved is_resolved TINYINT(1) NOT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX fk_referral_patient TO IDX_73079D006B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX fk_referral_from_doctor TO IDX_73079D0097686EAD
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX fk_referral_to_doctor TO IDX_73079D00B6572C66
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_alarm (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_allergy (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_consultation (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_disease (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_doctor (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_medicalletter (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_medication (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_patient (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_prescription (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_recommendation (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE audit_referral (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(8) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, object_id VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, discriminator VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, transaction_hash VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, diffs LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, blame_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, blame_user VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ip VARCHAR(45) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_alarm_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_allergy_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_consultation_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_disease_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_doctor_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_medical_letter_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_medication_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_patient_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_prescription_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_recommendation_audit
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE audit_referral_audit
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alarm CHANGE parameter parameter VARCHAR(100) NOT NULL, CHANGE condition_type condition_type VARCHAR(100) NOT NULL, CHANGE message message TEXT NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alarm RENAME INDEX idx_749f46dd6b899279 TO fk_alarm_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy CHANGE name name VARCHAR(255) NOT NULL, CHANGE severity severity VARCHAR(255) DEFAULT NULL, CHANGE reaction reaction TEXT DEFAULT NULL, CHANGE notes notes TEXT DEFAULT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy RENAME INDEX idx_cbb142b56b899279 TO fk_allergy_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE consultation ADD reason TEXT NOT NULL, ADD diagnosis_icd10 VARCHAR(20) NOT NULL, CHANGE symptoms symptoms TEXT NOT NULL, CHANGE current_medication_ids current_medication_ids TEXT DEFAULT NULL, CHANGE medical_history_ids medical_history_ids TEXT DEFAULT NULL, CHANGE family_history family_history TEXT DEFAULT NULL, CHANGE notes notes TEXT DEFAULT NULL, CHANGE diagnosis_ids diagnosis_ids TEXT DEFAULT NULL, CHANGE referral_ids referral_ids TEXT DEFAULT NULL, CHANGE prescription_ids prescription_ids TEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE is_active is_active TINYINT(1) DEFAULT 1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease CHANGE type type VARCHAR(100) NOT NULL, CHANGE description description TEXT NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE roles roles JSON DEFAULT 'json_array(_utf8mb4\\''ROLE_DOCTOR\\'')' NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor RENAME INDEX uniq_1fc0f36ae7927c74 TO email
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a53ccaa4b7 TO fk_medical_letter_referral
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a56b899279 TO fk_medical_letter_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a532440d8d TO fk_medical_letter_from_specialist
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a5b6572c66 TO fk_medical_letter_to_doctor
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a562ff6cdf TO fk_medical_letter_consultation
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication CHANGE dose dose VARCHAR(100) NOT NULL, CHANGE frequency frequency VARCHAR(100) NOT NULL, CHANGE route route VARCHAR(100) NOT NULL, CHANGE start_date start_date DATE NOT NULL, CHANGE notes notes TEXT DEFAULT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient CHANGE valid_account valid_account TINYINT(1) DEFAULT 1, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX uniq_1adad7ebe7927c74 TO email
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX uniq_1adad7eb1eab9b7e TO cnp
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE prescription CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation CHANGE activity_type activity_type VARCHAR(100) NOT NULL, CHANGE additional_notes additional_notes TEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE is_active is_active TINYINT(1) DEFAULT 1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral CHANGE type type VARCHAR(255) NOT NULL, CHANGE reason reason TEXT NOT NULL, CHANGE is_resolved is_resolved TINYINT(1) DEFAULT 0, CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX idx_73079d006b899279 TO fk_referral_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX idx_73079d0097686ead TO fk_referral_from_doctor
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX idx_73079d00b6572c66 TO fk_referral_to_doctor
        SQL);
    }
}
